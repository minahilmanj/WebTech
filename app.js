$(document).ready(function () {

  const apiURL = "https://jsonplaceholder.typicode.com/posts";
  const postModal = new bootstrap.Modal(document.getElementById("postModal"));

  
  function loadPosts() {
    $("#loading").show();
    $.get(apiURL, function (posts) {
      $("#loading").hide();

      let rows = "";
      posts.slice(0, 10).forEach(post => {
        rows += `
          <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
              <button class='btn btn-warning btn-sm editBtn' data-id='${post.id}' data-title='${post.title}' data-body='${post.body}'>Edit</button>
              <button class='btn btn-danger btn-sm deleteBtn' data-id='${post.id}'>Delete</button>
            </td>
          </tr>`;
      });

      $("#postTable").html(rows);
    });
  }

  loadPosts();

  // Add Post button
  $("#addPostBtn").click(() => {
    $("#postId").val("");
    $("#postForm")[0].reset();
    postModal.show();
  });

  // Save Post (Create / Update)
  $("#postForm").submit(function (e) {
    e.preventDefault();

    let id = $("#postId").val();
    let data = { title: $("#title").val(), body: $("#body").val() };

    if (id) {
      $.ajax({
        url: `${apiURL}/${id}`,
        method: "PUT",
        data,
        success: function () {
          alert("Post updated successfully!");
          postModal.hide();
          loadPosts();
        }
      });
    } else {
      $.post(apiURL, data, function () {
        alert("Post added successfully!");
        postModal.hide();
        loadPosts();
      });
    }
  });

  // Edit button click
  $(document).on("click", ".editBtn", function () {
    $("#postId").val($(this).data("id"));
    $("#title").val($(this).data("title"));
    $("#body").val($(this).data("body"));
    postModal.show();
  });

  // Delete Post
  $(document).on("click", ".deleteBtn", function () {
    let id = $(this).data("id");

    if (confirm("Are you sure you want to delete?")) {
      $.ajax({
        url: `${apiURL}/${id}`,
        method: "DELETE",
        success: function () {
          alert("Post deleted!");
          loadPosts();
        }
      });
    }
  });

});
