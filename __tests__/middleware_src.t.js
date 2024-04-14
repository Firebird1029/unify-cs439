import { middleware, config } from "../src/middleware";
import updateSession from "@/utils/supabase/middleware";

jest.mock("../src/utils/supabase/middleware", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("supabase-middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("middleware", () => {
    test("calls updateSession with the request object", async () => {
      const request = { some: "request" };
      const response = { some: "response" };

      updateSession.mockResolvedValueOnce(response);

      const result = await middleware(request);

      expect(updateSession).toHaveBeenCalledWith(request);
      expect(result).toEqual(response);
    });

    test("throws an error if updateSession throws an error", async () => {
      const request = { some: "request" };
      const error = new Error("Something went wrong");

      updateSession.mockRejectedValueOnce(error);

      await expect(middleware(request)).rejects.toThrow(error);
    });
  });

  describe("config", () => {
    test("matches the expected paths", () => {
      expect(config.matcher).toEqual([
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      ]);
    });
  });
});
