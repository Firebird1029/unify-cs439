import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import createClient from "@/utils/supabase/client";
import IndexPage from "../src/app/page";
import loginWithSpotify from "@/app/login/actions";

// Dependency mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../src/utils/supabase/client", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../src/app/login/actions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("IndexPage", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state when loggedIn is undefined", () => {
    render(<IndexPage />);
    expect(screen.getByText("Getting things set up...")).toBeInTheDocument();
  });

  test("redirects to error page when supabase.auth.getUser fails", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockRejectedValue(new Error("Supabase error")),
      },
    };
    createClient.mockReturnValue(mockSupabase);

    render(<IndexPage />);

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(
        "/error?message=Supabase error",
      );
    });
  });

  test("has log in button when user is not logged in", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue(null),
      },
    };
    createClient.mockReturnValue(mockSupabase);

    render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByText("Log in with Spotify")).toBeInTheDocument();
    });
  });

  test("sets loggedIn to true when user is already logged in", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 1 } } }),
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: { id: 1 } } }),
      },
    };
    createClient.mockReturnValue(mockSupabase);

    render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByText("Continue to Account")).toBeInTheDocument();
    });
  });

  test("redirects to error page on sign-out error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<IndexPage />);

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(
        "/error?message=Network error",
      );
    });
  });

  test("redirects to the home page on successful sign-out", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    Object.defineProperty(window, "location", {
      value: {
        href: "",
      },
      writable: true,
    });

    render(<IndexPage />);
    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(window.location.href).toBe("/");
    });
  });

  test("tests loginWithSpotify on button click", async () => {
    // Ensures user is not logged in initially
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    };
    createClient.mockReturnValue(mockSupabase);

    render(<IndexPage />);

    fireEvent.click(screen.getByText("Log in with Spotify"));
    expect(loginWithSpotify).toHaveBeenCalled();
  });

  test("redirects to error page on sign-out failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Forbidden",
    });

    const router = useRouter();
    render(<IndexPage />);

    fireEvent.click(screen.getByText("Logout"));

    // Wait for the async actions and effects to complete, then check for error
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/error?message=Forbidden");
    });
  });
});
