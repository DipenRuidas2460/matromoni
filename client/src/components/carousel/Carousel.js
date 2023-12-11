import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const data = [
  {
    logo: "/cotation.png",
    text: `Pooja wanted a partner who lives abroad. The journey of
    togetherness for this couple started with Vysakh sending a
    request to Pooja and she soon accepted it."Pooja bubbly
    pictures caught my attention instantly and I glanced through
    her profile. She is well educated, which is one of the things I
    was lokking for in a life partner," begins Vysakh.`,
    name: "Puja & Vysakh",
    photo: "/jodi-1.png",
  },
  {
    logo: "/cotation.png",
    text: `Suman wanted a life partner who lives in Matro Cities in India. 
    The journey of togetherness for this couple started with Suman sending 
    a request to Ritu and she soon accepted it. "Ritu's pictures grave my attation 
    and I visit her profile. She has extra talent in singing, which is one of the things 
    I was looking for in a life partner,"begins Ritu.`,
    name: "Suman & Ritu",
    photo: "/jodi-2.webp",
  },
  {
    logo: "/cotation.png",
    text: `Kajal wanted a partner who lives abroad. The journey of
    togetherness for this couple started with Naresh sending a
    request to Kajal and she soon accepted it."Kajal bubbly
    pictures caught my attention instantly and I glanced through
    her profile. She is well educated, which is one of the things I
    was lokking for in a life partner," begins Naresh.`,
    name: "Kajal & Naresh",
    photo: "/jodi-5.jpg",
  },
];

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="home-conten-box2">
      <h2 className="stories">Happy Stories on Indian Diaspora</h2>
      <div className="deatils-stories">
      <Slider {...settings}>
        {data.map((d) => (
          <div className="cotaion-details">
            <div className="stroies-text-details">
              <img className="coation-img" src={d.logo} alt="cotation" />
              <p className="story-para">{d.text}</p>
              <strong className="marrage-name">{d.name}</strong>
            </div>
            <img className="jodi-photo" src={d.photo} alt="jodi" />
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
}

export default Carousel;
