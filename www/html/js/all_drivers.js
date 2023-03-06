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
      output.username = input.user.username;
      output.first_name = input.user.first_name;
      output.last_name = input.user.last_name;
      output.phone_number = input.user.phone_number;
      output.user_photo = input.user.user_photo;
      output.user_dob = input.user.user_dob;
      output.email = input.user.email;
      output.title = input.user.role.title;
      output.is_active = input.is_active;
      output.card_id = input.card_id;
      
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
    
    fetch('http://127.0.0.1:8000/api/drivers/?is_active=true', {
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
    fetch('http://127.0.0.1:8000/api/drivers/?is_active=true', {
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
            return user.user.id.toString() === searchQuery;
          } else if (searchCategory === 'Имя Фамилия') {
            const fullName = `${user.user.first_name} ${user.user.last_name}`;
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Имя пользователя') {
            return user.user.username.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Email') {
            return user.user.email.toLowerCase().includes(searchQuery.toLowerCase());
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
          $('#error-message-search').text('Пользователь не найден!').css('color', 'red');
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
  
  
          // Populate the div element with relevant data
          div.innerHTML = `
              <div class="text-center card-box">
                  <div class="member-card pt-2 pb-2">
                      <div class="thumb-lg member-thumb mx-auto"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                      <div class="">
                          <h4>${user.user.first_name + ' ' + user.user.last_name}</h4>
                          <p class="text-muted">Email <span>| </span><span><a href="#" class="text-pink">${user.user.email}</a></span></p>
                          <p class="text-muted">Телефон <span>| </span><span><a href="#" class="text-pink">${user.user.phone_number}</a></span></p>
                      </div>
                      <button type="button" class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light" id=${user.user.id}">Профиль</button>
                      <div class="mt-4">
                          <div class="row">
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.category.title}</h4>
                                      <p class="mb-0 text-muted">Категория прав</p>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.user.user_dob}</h4>
                                      <p class="mb-0 text-muted">Дата рождения</p>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.user.id}</h4>
                                      <p class="mb-0 text-muted">ID пользователя</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  
          // Append the created div element to the parent element
          document.getElementById('user-container').appendChild(div);
        });
      });
  }});

  // Make API request with token
  fetch('http://127.0.0.1:8000/api/drivers/?is_active=true', {
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
      const dobCounts = {};

    // loop through the driver data and extract the DOB information
    data.forEach(driver => {
      const dob = new Date(driver.user.date_joined).toLocaleDateString();
      if (dob in dobCounts) {
        dobCounts[dob]++;
      } else {
        dobCounts[dob] = 1;
      }
    });

    // create an array of labels and counts for the graph
    const labels = Object.keys(dobCounts);
    const counts = Object.values(dobCounts);

    // create a bar chart using Chart.js library
    const ctx = document.getElementById('dob-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Водители/Дата регистрации ',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
      // Convert API response to a JavaScript object
      const users = data;

      // Loop through the data and create a div element for each item
      users.forEach(user => {
        console.log(user.user.user_photo)
        const div = document.createElement('div');
        div.setAttribute('class', 'col-lg-4');
        const count = document.querySelector('.count_drivers')
        count.setAttribute('placeholder', 'Найдено: '+data.length);
          
        // Populate the div element with relevant data
        if (user.user.user_photo == null) {
          var user_photo = 'https://oir.mobi/uploads/posts/2021-04/1619619348_59-oir_mobi-p-samie-milie-kotiki-zhivotnie-krasivo-foto-65.jpg'
        } else {
          var user_photo = '../../media/media/' + user.user.user_photo.split('/').pop();
        };
        div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${user.user.first_name + ' ' + user.user.last_name}</h4>
                        <p class="text-muted">Email <span>| </span><span><a href="#" class="text-pink">${user.user.email}</a></span></p>
                        <p class="text-muted">Телефон <span>| </span><span><a href="#" class="text-pink">${user.user.phone_number}</a></span></p>
                    </div>
                    <button type="button" class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light" id=${user.user.id}">Профиль</button>
                    <div class="mt-4">
                        <div class="row">
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.category.title}</h4>
                                    <p class="mb-0 text-muted">Категория прав</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.user.user_dob}</h4>
                                    <p class="mb-0 text-muted">Дата рождения</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.user.id}</h4>
                                    <p class="mb-0 text-muted">ID пользователя</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the created div element to the parent element
        document.getElementById('user-container').appendChild(div);
      });
      var graphsButton = document.getElementById('graphs');

      // Attach a click event listener to the button
      graphsButton.addEventListener('click', function() {
        event.preventDefault(); 
        // Find the canvas element by ID
        var dobChart = document.getElementById('dob-chart');
        dobChart.scrollIntoView({ behavior: 'smooth' });
      });
          })
    .catch(error => console.error(error));
    
});