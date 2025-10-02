const query = `#graphql
    query getProblems($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                acRate
                difficulty
                isPaidOnly
                status
                title
                titleSlug
                topicTags {
                    name
                    slug
                }
            }
        }
}`;

export default query;
