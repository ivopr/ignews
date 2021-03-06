import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const mockedPost: {
  slug: string
  title: string
  content: string
  updatedAt: string
} = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post Excerpt</p>",
  updatedAt: "10 de Abril"
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock("next/router");

describe('Post Preview Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    });

    render(<Post post={mockedPost} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post Excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it('redirects user if subscription is found', async () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-sub"
      } as any,
      status: "authenticated"
    });

    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<Post post={mockedPost} />);

    expect(pushMock).toBeCalledWith("/posts/my-new-post");
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          content: [
            { type: "paragraph", text: "Post content", spans: [] }
          ],
          title: [
            { type: "heading", text: "My new post" }
          ],
        },
        last_publication_date: "04-01-2021"
      }),
    } as any);

    const response = await getStaticProps({
      params: {
        slug: "my-new-post"
      }
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021"
          }
        }
      })
    );
  });
});