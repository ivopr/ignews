import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const mockedPosts: {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}[] = [
  {
    slug: "my-new-post",
    title: "My New Post",
    excerpt: "Post Excerpt",
    updatedAt: "10 de Abril"
  }
];

jest.mock("../../services/prismic");

describe('Posts Page', () => {
  it('renders correctly', () => {
    render(<Posts posts={mockedPosts} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [{
          uid: "my-new-post",
          data: {
            title: [
              { type: "heading", text: "My new post" }
            ],
            content: [
              { type: "paragraph", text: "Post excerpt" }
            ],
          },
          last_publication_date: "04-01-2021"
        }]
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: "my-new-post",
            title: "My new post",
            excerpt: "Post excerpt",
            updatedAt: "01 de abril de 2021"
          }]
        }
      })
    );
  });
});