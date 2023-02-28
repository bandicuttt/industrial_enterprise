$(document).ready(function() {
  // Make an AJAX request to get the profile data
  $.ajax({
    url: 'http://127.0.0.1:8000/api/profile/driver/',
    type: 'GET',
    dataType: 'json',
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NTM3MTk4LCJqdGkiOiI4NDYzN2M0NWQ3MjY0NmIzODEzMWViZGY3ZmY2NjNkMyIsInVzZXJfaWQiOjF9.nPPoDc8nUWGVtsABtE8bQoU8OpMI5dC6w7-OHZh1ZjU"
    },
    success: function(data) {
      console.log(data.user.user_photo)
      // Update the HTML fields with the response data
      $('#full_name').val(data.user.first_name + ' ' + data.user.last_name);
      $('#email').val(data.user.email);
      $('#phone').val(data.user.phone_number);
      $('#role').val(data.user.role.title);
      $('#dob').val(data.user.user_dob);
      $('#profile_pic').attr('src', data.user.user_photo);
    },
    error: function(xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });

});