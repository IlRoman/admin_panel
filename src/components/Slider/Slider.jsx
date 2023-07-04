import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.scss';

export const SliderComponent = ({ data }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="slider-wrapper">
            <Slider {...settings}>
                {data?.map((elem, index) => {
                    return (
                        <div className="slider-block" key={index}>
                            <div className="slider-block__container">
                                <div
                                    className="slider-block__image"
                                    style={{ background: `url(${elem.image}) center / cover` }}
                                />
                                <div className="slider-block__name">{elem.name}</div>
                                <div className="slider-block__info">{elem.info}</div>
                            </div>
                        </div>
                    )
                })}
            </Slider>
        </div>
    );
};
