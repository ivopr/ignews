import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { mocked } from "jest-mock"
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe('SignInButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(
      <SignInButton />
    );

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          image: "https://placekitten.com/512/512"
        },
        expires: ""
      },
      status: "authenticated"
    });

    render(
      <SignInButton />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});