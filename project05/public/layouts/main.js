$(document).ready(function () {
  $('#deleteEvent').on('click', function (e) {
    e.preventDefault();
    var deleteId = $(this).data('delete');
    $.ajax({
      url: '/events/delete/' + deleteId,
      type: 'DELETE',
      success: function (result) {
        console.log(result);
      }
    });
    window.location = '/events';
  });
});
