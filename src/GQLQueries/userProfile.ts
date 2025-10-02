const query = `#graphql
query getUserProfile($username: String!) {
    matchedUser(username: $username) {
        submitStats {
            acSubmissionNum {
                difficulty
                count
            }
        }
    }
}`;

export default query;
