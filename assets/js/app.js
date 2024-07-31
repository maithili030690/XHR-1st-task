const cl= console.log;

const postForm =document.getElementById('postForm');
const titleControl =document.getElementById('title');
const contentControl =document.getElementById('content');
const userIdControl = document.getElementById('userId');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const postContainer = document.getElementById('postContainer');

const BASE_URL =`https://jsonplaceholder.typicode.com/`;
const POST_URL = `${BASE_URL}/posts`;


let postArr =[];
let templating =(arr)=>{
    let result ='';
    arr.forEach(ele=>{
        result += `
        <div class="col-md-4 my-4">
            <div class="card h-100 postCard text-white"id="${ele.id}">
               <div class="card-header">
                  <h3 class="m-0">${ele.title}</h3>
               </div>
               <div class="card-body">
                  <p class="m-0">${ele.body}</p>
               </div>
               <div class="card-footer d-flex justify-content-between">
                  <button onclick ="onEdit(this)" class="btn btn-primary btn-sm text-white">Edit</button>
                  <button onclick ="onRemove(this)"class="btn btn-danger btn-sm text-white">Remove</button>
               </div>
            </div>
         </div>
        `
    })
    postContainer.innerHTML =result;
}

const onEdit =(ele=>{
    cl(ele);
    let editId = ele.closest('.card').id;
    localStorage.setItem("editId",editId);

    let EDIt_URL = `${BASE_URL}/posts/${editId}`
    
    // Scroll to the top
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Use 'auto' for instant scrolling
    });

    //loader start
    loader.classList.remove('d-none');

       //1.create API call
    let xhr = new XMLHttpRequest()

    //2. configuration
    xhr.open("GET",EDIt_URL);

    //3.xhr.send()
    xhr.send();

    //4.xhr.onload

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <300){
            cl(xhr.response)
            let post = JSON.parse(xhr.response);
            titleControl.value = post.title;
            contentControl.value = post.body;
            userIdControl.value = post.userId;

            updateBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');
        }
        //loader hide
        loader.classList.add('d-none');
    }
    
    
})

const onPostUpdate = (eve)=>{
    let updatedObj ={
        title :titleControl.value,
        body :contentControl.value,
        userId:userIdControl.value,
    }
    let updateId =localStorage.getItem('editId');
    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

      //loader start
      loader.classList.remove('d-none');

      //1.create API call
      let xhr =new XMLHttpRequest();


    //2.configuration
    xhr.open("PATCH",UPDATE_URL);

    //3. send()
    xhr.send(JSON.stringify(updatedObj));

    //4. onload()

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            let card = [...document.getElementById(updateId).children];
            cl(card);
            card[0].innerHTML =` <h3 class="m-0">${updatedObj.title}</h3> `
            card[1].innerHTML =` <p class="m-0">${updatedObj.body}</p>`
            postForm.reset();

            updateBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
        }
                //loader hide
                loader.classList.add('d-none');
    }

    const onScrollEdit=(eve)=>{
        let scrollEdit={
            title : titleControl.value,
            body : contentControl.value.trim(),
            userId :userIdControl.value,
        }
        cl(onScrollEdit);
    
    }
}

const onRemove =(ele)=>{
   
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let removeId = ele.closest('.card').id;
                cl(removeId);
                let REMOVE_URL =`${BASE_URL}/posts/${removeId}`;

                    //loader start
                    loader.classList.remove('d-none');
                //get confirmation

                    //1.create API call
                    let xhr =new XMLHttpRequest();

                    //2.configuration
                    xhr.open("DELETE",REMOVE_URL);

                    //3.send()
                    xhr.send();

                    //4.onload
                    xhr.onload =function(){
                        if(xhr.status >= 200 && xhr.status < 300){
                        ele.closest('.col-md-4').remove()
                        }
                                //loader hide
                                loader.classList.add('d-none');
                    }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });


}
const fetchPost =()=>{

      //loader start
      loader.classList.remove('d-none');

    //1.create API call

    let xhr = new XMLHttpRequest();

    //2.configuration

    xhr.open("GET",POST_URL);

    //3.send

    xhr.send(null);

    //4.onload
    xhr.onload =function(){
        if(xhr.status >= 200 && xhr.status < 300){
            postArr = JSON.parse(xhr.response)
            templating(postArr);
        }
                //loader hide
                loader.classList.add('d-none');
    }

}
fetchPost();

const onPostSubmit =(eve)=>{
    eve.preventDefault();
   let newPost ={
    title : titleControl.value,
    body : contentControl.value.trim(),
    userId :userIdControl.value,
   }
   cl(newPost);
   postForm.reset();

     //loader start
     loader.classList.remove('d-none');

   //create API Call
   let xhr = new XMLHttpRequest();

   //configuration

   xhr.open("POST",POST_URL);

   //send()
   xhr.send(JSON.stringify(newPost));

   //onload

   xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        cl(xhr.response)
        newPost.id = JSON.parse(xhr.response).id;
        let div = document.createElement('div');
        div.className ='col-md-4 my-4';
        div.innerHTML = `
                    <div class="card h-100 postCard text-white"id="${newPost.id}">
                        <div class="card-header">
                            <h3 class="m-0">${newPost.title}</h3>
                        </div>
                        <div class="card-body">
                            <p class="m-0">${newPost.body}</p>
                        </div>
                       <div class="card-footer d-flex justify-content-between">
                            <button onclick ="onEdit(this)" class="btn btn-primary btn-sm text-white">Edit</button>
                            <button onclick ="onRemove(this)"class="btn btn-danger btn-sm text-white">Remove</button>
                       </div>
                    </div>
        `
        postContainer.prepend(div);
    }
            //loader hide
            loader.classList.add('d-none');
   }
}


     
postForm.addEventListener('submit',onPostSubmit);
updateBtn.addEventListener('click',onPostUpdate);
