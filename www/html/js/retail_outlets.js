const token = localStorage.getItem('accessToken');

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
  } else {
    window.location.href = 'http://localhost/industrial_enterprise/www/html/auth.html';
  }
})
.catch(error => {
  console.error(error);
});


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
      if (data.role.title === 'Администратор') {
        
      } else {
        window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_menu.html';
      };
    } catch (error) {

                    }
      },
  
  error: function(xhr, status, error) {
    console.log('Error: ' + error.message);
  }
});



// Execute code when the DOM content has been loaded
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('#search_drivers');
  const downloadButton = document.querySelector('#download_drivers');
  downloadButton.addEventListener('click', (event) => {
    event.preventDefault();
    function formatDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const formattedDate = `${day}:${month}:${year}-${hour}:${minute}`;
      return formattedDate;
    }

    function transformUser(input) {
      const output = {};
      
      output.id = input.id;
      output.outlet_photo = input.outlet_photo;
      output.outlet_phone = input.outlet_phone;
      output.outlet_name = input.outlet_name;
      output.outlet_address = input.outlet_address;
      return output;
    }
    
    function downloadExcelFile(data) {
      const formattedDate = formatDate();
      const filename = `${formattedDate}.xlsx`;
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
      XLSX.writeFile(workbook, filename);
    }
    
    fetch('http://127.0.0.1:8000/api/retailoutlets/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        const transformedUsers = [];

        for (const user of data) {
          const transformedUser = transformUser(user);
          transformedUsers.push(transformedUser);
        }

        console.log(transformedUsers);
        downloadExcelFile(transformedUsers);
      })
      .catch(error => {
        console.error(error);
            });
        });
  searchButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get search query and category from input fields
    const searchQuery = document.querySelector('input[type=search]').value;
    const searchCategory = document.querySelector('#Search_for_category').value;
    if (searchQuery == '' || searchCategory == 'Не выбрано') {
      $('#error-message-search').text('Заполните поля!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
    } else {
      fetch('http://127.0.0.1:8000/api/retailoutlets/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => response.json())
    .then(users => {
        // Filter user data based on search query and category
        const filteredUsers = users.filter(user => {
          if (searchCategory === 'ID') {
            return user.id.toString() === searchQuery;
          } else if (searchCategory === 'Название') {
            return user.outlet_name.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Контактный телефон') {
            const weight = user.outlet_phone.toString()
            return weight.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Адрес') {
            return user.outlet_address.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Все') {
            return true;
          } else {
            $('#error-message-search').text('Категория поиска не выбрана!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
          }
        }); // Add closing parenthesis here
        if (filteredUsers.length === 0 && searchCategory != 'Не выбрано') {
          $('#error-message-search').text('Торговая точка не найден!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
        }
        const cols = document.querySelectorAll('.col-lg-4');
        cols.forEach(col => {
          col.style.display = 'none';
        });
        
        filteredUsers.forEach(user => {
          const div = document.createElement('div');
          div.setAttribute('class', 'col-lg-4');
          const count = document.querySelector('.count_drivers')
          count.setAttribute('placeholder', 'Найдено: '+filteredUsers.length);
          if (user.outlet_photo == null) {
            var user_photo = 'media/retail_outlet.jpg'
          } else {
            var user_photo = '../../media/media/' + user.outlet_photo.split('/').pop();
          };
  
          // Populate the div element with relevant data
          div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${user.outlet_name}</h4>
                        <p class="text-muted">ID<span> | </span><span><a href="#" class="text-pink">${user.id}</a></span></p>
                        <p class="text-muted">Контактный номер <span>| </span><span><a href="#" class="text-pink">${user.outlet_phone}</a></span></p>
                        <p class="text-muted">Адрес <span>| </span><span><a href="#" class="text-pink">${user.outlet_address}</a></span></p>
                    </div>
                </div>
            </div>
        `;
  
          // Append the created div element to the parent element
          document.getElementById('user-container').appendChild(div);
          const driverButtons = document.querySelectorAll('.btn.btn-primary.mt-3.btn-rounded.waves-effect.w-md.waves-light');
      driverButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const ProfileId = event.target.id;
          console.log(ProfileId)
          window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_view.html?id='+ProfileId;
        });
      });
        });
      });
  }});

  // Make API request with token
  fetch('http://127.0.0.1:8000/api/retailoutlets/', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  .then(response => {
    if (response.status === 200) {
      console.log('Норм');
      
    } else {
      console.log('Пиздец');
    }
    return response.json();
  })
    .then(data => {
      const users = data;
      users.forEach(user => {
        const div = document.createElement('div');
        div.setAttribute('class', 'col-lg-4');
        const count = document.querySelector('.count_drivers')
        count.setAttribute('placeholder', 'Найдено: '+data.length);
          
        // Populate the div element with relevant data
        if (user.outlet_photo == null) {
          var user_photo = 'media/retail_outlet.jpg'
        } else {
          var user_photo = '../../media/media/' + user.outlet_photo.split('/').pop();
        };
        div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${user.outlet_name}</h4>
                        <p class="text-muted">ID<span> | </span><span><a href="#" class="text-pink">${user.id}</a></span></p>
                        <p class="text-muted">Контактный номер <span>| </span><span><a href="#" class="text-pink">${user.outlet_phone}</a></span></p>
                        <p class="text-muted">Адрес <span>| </span><span><a href="#" class="text-pink">${user.outlet_address}</a></span></p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('user-container').appendChild(div);
        });
      const driverButtons = document.querySelectorAll('.btn.btn-primary.mt-3.btn-rounded.waves-effect.w-md.waves-light');
      driverButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const ProfileId = event.target.id;
          if (ProfileId === 'graphs') {
            dobChart.scrollIntoView({ behavior: 'smooth' });
          } else {
          window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_view.html?id='+ProfileId;
        }
        });
      });
          })
    .catch(error => console.error(error));
    
});