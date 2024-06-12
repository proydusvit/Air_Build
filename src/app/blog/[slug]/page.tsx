import { StructuredText, Image as DatocmsImage } from 'react-datocms';
import { responsiveImageFragment } from "../../../../lib/fragments";
import { performRequest } from '../../../../lib/datocms';

const GET_ARTICLE = `
  query allPosts($slug: String) {
    post(filter: {slug: {eq: $slug}}) {
      _createdAt
      author {
        author
        id
        picture {
          url
        }
      }
      title
      slug
      coverImage {
        url
      }
      content {
        value
        blocks {
          __typename
          ... on ImageBlockRecord {
            id
 image {
              responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                ...responsiveImageFragment
              }
            }
          }
        }
      }
    }
  }
     ${responsiveImageFragment}
`;

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  try {
    const data = await performRequest({
      query: GET_ARTICLE,
      variables: { slug: slug },
      revalidate: 60
    });


    if (!data || !data.post) {
      return <div>Post not found</div>;
    }

    return (
      <div>

        <p className='text-2xl'> {data.post.title}</p>
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg prose-blue" id="main-content">

            <StructuredText
              data={data.post.content}
              renderInlineRecord={({ record }) => {
                switch (record.__typename) {
                  case "BlogPostRecord":
                    return <a href={`/blog/${record.slug}`}>{data.post.record.title}</a>;
                  default:
                    return null;
                }
              }}
              renderLinkToRecord={({ record, children }) => {
                switch (record.__typename) {
                  case "BlogPostRecord":
                    return <a href={`/blog/${record.slug}`}>{children}</a>;
                  default:
                    return null;
                }
              }}
              renderBlock={({ record }) => {
                switch (record.__typename) {
                  case "ImageBlockRecord":
                    return record.image ? <DatocmsImage data={record.image.responsiveImage} /> : null;
                  default:
                    return null;
                }
              }}
            />

          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching data</div>;
  }
}
