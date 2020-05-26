$(document).ready(() => {
	$('#commentForm').on('submit', (e) => {
		let comments = '';

		if (!sessionStorage.getItem('Comment') == '') {
			comments = sessionStorage.getItem('Comment');
		}

		let id = sessionStorage.getItem('movieId');
		let commentString =
			'#' + id + '@' + $('#commentName').val() + '%' + $('#commentText').val(); // #ID @name %comment
		comments += commentString;
		sessionStorage.setItem('Comment', comments);
		window.location.reload();
		e.preventDefault();
	});
});

function getComments() {
	if (sessionStorage.getItem('Comment') === null) {
		sessionStorage.setItem('Comment', '');
	}

	let allComments = sessionStorage.getItem('Comment');
	let id = sessionStorage.getItem('movieId');
	let pageComments = [];

	let commentArr = allComments.split('#');
	commentArr.forEach((e) => {
		if (e.includes(id)) {
			let s1 = e.indexOf('@');
			let s2 = e.indexOf('%');
			let s3 = e.length - 1;
			let commentArr = [e.slice(s1 + 1, s2), e.slice(s2 + 1, s3 + 1)];
			pageComments.push(commentArr);
		}
	});
	let output = '';

	pageComments.forEach((e) => {
		output += `
    <div class="card border-dark mb-3 " ">
			<div class="card-header">
			<img src="/public/unnamed.jpg" class="img-thumbnail">
			${e[0]} 
			<p style="float: right;">
			<a onclick="window.location.reload();" class="btn " >Delete</a>
			<a onclick="window.location.reload();" class="btn " >Edit</a>
			</p>
			</div>
      <div class="card-body text-dark">
        <p class="card-text">${e[1]}</p>
			</div>
		</div>
		<br>
		

		
      `;
	});

	$('#comments').html(output);
}
