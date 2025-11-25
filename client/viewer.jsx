const TweetView = () => {
    const [tweets, setTweets] = React.useState([]);

    React.useEffect(() => {
        const loadTweets = async () => {
            const res = await fetch('/viewTweets');
            const data = await res.json();
            setTweets(data.tweets);
        };
        loadTweets();
    }, []);

    if (tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }

    return (
        <div className="tweetList">
            {tweets.map((tweet) => (
                <div key={tweet._id} className="tweet">
                    <h3 className="tweetTitle">Title: {tweet.title}</h3>
                    <h3 className="tweetContent">Content: {tweet.content}</h3>
                </div>
            ))}
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render();
};

window.onload = init;