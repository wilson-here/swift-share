import luImage from "../assets/img/cat/lu.jpg";

export const categories = [
  {
    name: "lu 🐷🐷🐷",
    image: luImage,
  },
  {
    name: "coding",
    image: "https://cdn-icons-png.flaticon.com/512/268/268998.png",
  },
  {
    name: "gym",
    image:
      "https://media.istockphoto.com/id/1331186720/vector/dumbbell.jpg?s=612x612&w=0&k=20&c=ztAKf6ZaSrWTBQVW7Nj2yrEbGM0FxitFrze39W-HdMs=",
  },
  {
    name: "dota",
    image: "https://1000logos.net/wp-content/uploads/2019/03/Dota-2-Logo.png",
  },
  {
    name: "taylor swift",
    image: "https://i.ytimg.com/vi/ic8j13piAhQ/maxresdefault.jpg",
  },
  {
    name: "japanese",
    image:
      "https://media.proprofs.com/images/FC/user_images/1859857/5272673854.png",
  },
];

// retrieve the user info from Sanity's database based on the userId
export const userQuery = (userId) => {
  const query = `*[_type=="user" && _id=='${userId}']`;
  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image{
    asset->{
      url
    }
  },
  _id,
  destination,
  postedBy->{
    _id,
    userName,
    image
  },
  save[]{
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
  },
}`;

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    // image of the pin
    image{
      asset->{
        url
      }
    },
    // id of the pin doc 
    _id,  
    title, 
    about,
    category,
    destination,
    // thông tin author of pin 
    postedBy->{
      _id,
      userName,
      image
    },
    // mảng chứa thông tin tất cả người lưu pin 
   save[]{ 
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      // id của từng comment cho pin này 
      _key, 
      // nội dung comment 
      comment, 
      // người comment 
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

//  lấy more pin cùng cat với pin hiện tại
export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

// tim tat ca cac pin co userId (pin author) bang voi param
export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

// tim tat ca cac pin co userId (pin author) nam trong save array
export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
