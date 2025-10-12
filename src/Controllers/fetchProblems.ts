import { Response } from 'express';
import { ProblemSetQuestionListData } from '../types';

const fetchProblems = async (
  options: { limit?: number; skip?: number; tags?: string; difficulty?: string, session?: string, csrftoken?: string }, // Mark parameters as optional
  res: Response,
  formatData: (data: ProblemSetQuestionListData) => {},
  query: string
) => {
  try {
    // always set limit to 20 if it is undefined, since the function is fetchProblems and expect multiple problems
    const limit = options.limit === undefined ? 2000 : options.limit
    const skip = options.skip || 0; // Default to 0 if not provided
       // Tags: accept space or plus separated; trim empties; GraphQL expects an array of slugs
       const tagsArray = (options.tags || '')
       .split(/[ +]/)
       .map(t => t.trim())
       .filter(Boolean);
     // Difficulty: normalize to uppercase and validate enum values; otherwise omit
     const normalizedDifficulty = (options.difficulty || '').toUpperCase();
     const difficulty = ['EASY', 'MEDIUM', 'HARD'].includes(normalizedDifficulty)
       ? normalizedDifficulty
       : undefined;

   const crsftoken = options.csrftoken || "P01VtAN847Aem5J66YRy3bkRsJRLWF0OdQJGdNRtbXx8PnTXiHKEnMj3V0XfeKSe"
   const session = options.session || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiNTI1NDE2MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjczZjM3ZDM2NDYxYmUwYWFiYThjMzNiMjc1OWE5MTgyMjNmZTk3OTVmMTM3OTRiNTZkMzU0OWE3OGJmZDZiOGIiLCJzZXNzaW9uX3V1aWQiOiIyZmQxOTAyOSIsImlkIjo1MjU0MTYzLCJlbWFpbCI6InRsMDIyNnluQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidGwwMjI2eW4iLCJ1c2VyX3NsdWciOiJ0bDAyMjZ5biIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy90bDAyMjZ5bi9hdmF0YXJfMTczNjE0NTQxNi5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NTk1NTE5NzksImlwIjoiMjYwNDozZDA4OjRmODk6NjQwMDo6NjMyNCIsImlkZW50aXR5IjoiYThlMmQwYjM0ODNiMTZiMTlkZGI3ZTFiYTBmNGZiNGYiLCJkZXZpY2Vfd2l0aF9pcCI6WyJjNDVjOGVmODY0NDIxMzFkMzNhMWFhMDMwZDhmYmI1MSIsIjI2MDQ6M2QwODo0Zjg5OjY0MDA6OjYzMjQiXX0.ZhXV7BXPYHNj2ZPgv3mOD_tH3e1tSu2JXJr5fVNPVtQ"

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        "x-csrftoken": crsftoken,
        "cookie": `LEETCODE_SESSION=${session}; csrftoken=${crsftoken}`
      },
      body: JSON.stringify({
        query: query,
        variables: {
          categorySlug: '',
          skip,
          limit,
          filters: {
            ...(tagsArray.length > 0 ? { tags: tagsArray } : {}),
            ...(difficulty ? { difficulty } : {}),
          },
        },
      }),
    });
    console.log(response)

    const result = await response.json();

    if (result.errors) {
      return res.status(400).json(result.errors); // Return errors with a 400 status code
    }
    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.status(500).json({ error: 'Internal server error' }); // Return a 500 status code for server errors
  }
};

export default fetchProblems;
