import { cache } from 'react';

// const dedupedFetch = cache(async (serializedInit) => {
//   const response = await fetch("https://graphql.datocms.com/", JSON.parse(serializedInit));
//   const responseBody = await response.json();
//   if (!response.ok) {
//     throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
//   }
//   return responseBody;
// })
// export async function performRequest({
//   query,
//   variables = {},
//   includeDrafts = false,
//   excludeInvalid = false,
//   visualEditingBaseUrl=false,
//   revalidate,
//  }) {
//   const { data } = await dedupedFetch(JSON.stringify({
//     method: "POST",
//     headers: {
//       Authorization: `Bearer 3669217aa7c40ee4f804d85e87a26b`,
//       ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
//       ...(excludeInvalid ? { "X-Exclude-Invalid": "true" } : {}),
//       ...(visualEditingBaseUrl ? { "X-Visual-Editing": "vercel-v1", "X-Base-Editing-Url": visualEditingBaseUrl } : {}),
//       ...("main" ? { "X-Environment": "main-copy-2024-03-18"  } : {}),
//     },
//     body: JSON.stringify({ query, variables, revalidate }),
//     next: { revalidate },
//   }));
//   return data;
// }includeDrafts: isEnabled,import { cache } from 'react';

const dedupedFetch = cache(
  async (
    body,
    includeDrafts = false,
    excludeInvalid = false,
    visualEditingBaseUrl = null,
    revalidate,
  ) => {
    const headers = {
      Authorization: `Bearer 3669217aa7c40ee4f804d85e87a26b`,
      ...(includeDrafts ? { 'X-Include-Drafts': 'true' } : {}),
      ...(excludeInvalid ? { 'X-Exclude-Invalid': 'true' } : {}),
      ...(visualEditingBaseUrl
        ? {
            'X-Visual-Editing': 'vercel-v1',
            'X-Base-Editing-Url': visualEditingBaseUrl,
          }
        : {}),
      ...("main"
        ? { 'X-Environment': "main"  }
        : {}),
    };

    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers,
      body,
      next: { revalidate },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(
        `${response.status} ${response.statusText}: ${JSON.stringify(
          responseBody,
        )}`,
      );
    }

    return responseBody;
  },
);

export async function performRequest({
  query,
  variables = {},
  includeDrafts = false,
  excludeInvalid = false,
  visualEditingBaseUrl=null,
  revalidate,
}) {
  const { data } = await dedupedFetch(
    JSON.stringify({ query, variables, revalidate }),
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
  );

  return data;
}

// export const performRequest = async ({ query, variables = {}, includeDrafts = false }) => {
//   const response = await fetch("https://graphql.datocms.com/", {
//     headers: {
//       Authorization: `Bearer 3669217aa7c40ee4f804d85e87a26b`,
//       ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
//     },
//     method: "POST",
//     body: JSON.stringify({ query, variables }),
//   });
  
//   const responseBody = await response.json();
  
//   if (!response.ok) {
//     throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
//   }
  
//   return responseBody;
// }