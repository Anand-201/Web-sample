document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
    ])
    .then(([posts, users]) => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        const usersMap = {};
        users.forEach(user => {
            usersMap[user.id] = user;
        });

        posts.forEach(post => {
            const user = usersMap[post.userId];
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">
                    <p><strong>${user.name}</strong></p>
                    <p>${user.email}</p>
                </div>
                <button class="view-comments" data-post-id="${post.id}">View Comments</button>
                <div class="comments-container" id="comments-${post.id}"></div>
            `;
            postsContainer.appendChild(postElement);
        });

        document.querySelectorAll('.view-comments').forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                fetchComments(postId);
            });
        });
    })
    .catch(error => console.error('Error fetching posts or users:', error));
}

function fetchComments(postId) {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            commentsContainer.innerHTML = '';

            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.name}</strong> (${comment.email})</p>
                    <p>${comment.body}</p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}
