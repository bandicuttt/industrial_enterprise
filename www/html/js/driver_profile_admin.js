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
    body: JSON.stringify({
      user: {
        is_active: mode
      }
    })
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
        try {
          $('#driver').text(data.first_name + ' ' + data.last_name);
          $('#full_name').val(data.first_name + ' ' + data.last_name);
          $('#full_name_label').text(data.first_name + ' ' + data.last_name);
          $('#email').val(data.email);
          $('#phone').val(data.phone_number);
          $('#dob').val(data.user_dob);
          $('#role').val(data.role.title);
          $('#admin_nav_bar').css('display', 'block');
          $('#ban').css('display', 'none');
  
          if (data.user_photo == null) {
            var user_photo = 'https://oir.mobi/uploads/posts/2021-04/1619619348_59-oir_mobi-p-samie-milie-kotiki-zhivotnie-krasivo-foto-65.jpg'
            $('.rounded-circle').attr('src', user_photo);
          } else {
            var user_photo = '../../media/media/' + data.user_photo.split('/').pop();
            $('.rounded-circle').attr('src', user_photo);
          };
        } catch (error) {

          if (data.user.is_active == true) {
            $('.ban_or_unban_user').text('Заблокировать')
          } else {
            $('.ban_or_unban_user').text('Разблокировать')
          }

          $('#ban').click(function(e) {
            if (data.user.is_active == true) {
              updateProfileUser(data.user.id, token, false, 'drvier');
            } else {
              updateProfileUser(data.user.id, token, true, 'driver');
            }
            location.reload();
          });

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
          $('#driver').text(data.user.first_name + ' ' + data.user.last_name);
          $('#admin_nav_bar').css('display', 'block');
          
          
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


