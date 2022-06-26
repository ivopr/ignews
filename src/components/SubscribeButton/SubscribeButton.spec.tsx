import { fireEvent, render, screen } from "@testing-library/react";
import { useSession, signIn } from "next-auth/client";
import { mocked } from "jest-mock"
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next-auth/client");
jest.mock("next/router");

describe('SubscribeButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    const signInMocked = mocked(signIn);
    
    render(
      <SubscribeButton />
    );
    
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);
    
    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscription', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: "John Doe"
      },
      activeSubscription: "fake active sub",
      expires: "fake expire"
    }, false]);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(
      <SubscribeButton />
    );
    
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});