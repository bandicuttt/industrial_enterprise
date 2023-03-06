// Retrieve token from localStorage
const token = localStorage.getItem('accessToken');

// Verify token using API endpoint
fetch('http://127.0.0.1:8000/api/auth/jwt/verify/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ token: token })
})
.then(response => {
  if (response.status === 200) {
    // token is valid, continue with application logic
  } else {
    // token is invalid, redirect to login page
    window.location.href = 'http://localhost/industrial_enterprise/www/html/auth.html';
  }
})
.catch(error => {
  // handle fetch errors
  console.error(error);
});


$(document).ready(function() {
  $.ajax({
    url: 'http://127.0.0.1:8000/api/profile/',
    type: 'GET',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    success: function(data) {
      try {
        $('#full_name').val(data.first_name + ' ' + data.last_name);
        $('#full_name_label').text(data.first_name + ' ' + data.last_name);
        $('#email').val(data.email);
        $('#phone').val(data.phone_number);
        $('#dob').val(data.user_dob);
        $('#role').val(data.role.title);

        if (data.role.title === 'Администратор') {
          $('#user_nav_bar').css('display', 'none');
          $('#admin_nav_bar').css('display', 'block');
        };

        if (data.user_photo == null) {
          var user_photo = 'https://oir.mobi/uploads/posts/2021-04/1619619348_59-oir_mobi-p-samie-milie-kotiki-zhivotnie-krasivo-foto-65.jpg'
          $('.rounded-circle').attr('src', user_photo);
        } else {
          var user_photo = '../../media/media/' + data.user_photo.split('/').pop();
          $('.rounded-circle').attr('src', user_photo);
        };
      } catch (error) {
        console.log(error)
        $('#driver_initial_info').css('display', 'block');
        $('#full_name').val(data.user.first_name + ' ' + data.user.last_name);
        $('#full_name_label').text(data.user.first_name + ' ' + data.user.last_name);
        $('#email').val(data.user.email);
        $('#phone').val(data.user.phone_number);
        $('#dob').val(data.user.user_dob);
        $('#role').val(data.user.role.title);
        $('#category_title').val(data.category.title);
        $('#card_id').val(data.card_id);
        if (data.is_active === false) {
          $('#is_active').val('Свободен');
        } else {
          $('#is_active').val('Занят');
        }
        $('#user_nav_bar').css('display', 'none');
        $('#driver_nav_bar').css('display', 'block');

        
        if (data.user_photo == null) {
          var user_photo = 'https://oir.mobi/uploads/posts/2021-04/1619619348_59-oir_mobi-p-samie-milie-kotiki-zhivotnie-krasivo-foto-65.jpg'
          $('.rounded-circle').attr('src', user_photo);
        } else {
          var user_photo = '../../media/media/' + data.user_photo.split('/').pop();
          $('.rounded-circle').attr('src', user_photo);
        };
        
                      }
        },
    
    error: function(xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });
});