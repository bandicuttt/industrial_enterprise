// Retrieve token from localStorage
const token = localStorage.getItem('accessToken');

function updateProfileUser(id, token, mode) {
  const url = 'http://127.0.0.1:8000/api/admin/profile-usr/'+id+'/';
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({'is_active': mode})
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}



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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    $.ajax({
      url: 'http://127.0.0.1:8000/api/admin/profile-usr/'+id+'/',
      type: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: function(data) {
          $('#driver').text(data.first_name + ' ' + data.last_name);
          $('#full_name').val(data.first_name + ' ' + data.last_name);
          $('#full_name_label').text(data.first_name + ' ' + data.last_name);
          $('#email').val(data.email);
          $('#phone').val(data.phone_number);
          $('#dob').val(data.user_dob);
          $('#role').val(data.role.title);
          $('#admin_nav_bar').css('display', 'block');
          $('.btn.btn-info').click(function(e) {
            if (data.is_active == true) {
              updateProfileUser(data.id, token, false, 'drvier');
            } else {
              updateProfileUser(data.id, token, true, 'driver');
            }
            location.reload();
          });
          
          if (data.role.title == 'Водитель') {
            $('#driver_initial_info').css('display', 'block');
            $('#category_title').val(data.driver.category.title);
            $('#card_id').val(data.driver.card_id);
            if (data.driver.is_active === false) {
              $('#is_active').val('Свободен');
            } else {
              $('#is_active').val('Занят');
            }
            if (data.is_active == true) {
              $('.btn.btn-info').text('Заблокировать')
            } else {
              $('.btn.btn-info').text('Разблокировать')
            }
          } else {
            $('.btn.btn-info').css('display', 'none');
          }

          if (data.user_photo == null) {
            var user_photo = 'media/driver_photo.jpg'
            $('.rounded-circle').attr('src', user_photo);
          } else {
            var user_photo = '../../media/media/' + data.user_photo.split('/').pop();
            $('.rounded-circle').attr('src', user_photo);
        } 
          },
      error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });
    
    
  });


