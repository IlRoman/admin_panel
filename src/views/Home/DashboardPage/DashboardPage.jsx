import React, { useEffect, useState } from 'react';
import { SliderComponent } from '../../../components/Slider/Slider';
import { CustomInput } from '../../../components/CustomInput/CustomInput';
import room from '../../../assets/images/room.png';
import './dashboard.scss';

export const DashboardPage = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState({
        spaces: '',
        clients: '',
        freelancers: '',
        MPSPs: ''
    });

    useEffect(() => {
        let arr = new Array(13).fill('')
        setData(arr.map((elem, index) => {
            return {
                id: index,
                name: 'Name of the space',
                info: 'https://my.matterport.com/show',
                image: room,
            }
        }))
    }, []);

    const onChangeInput = (value, name) => {
        setSearch(prev => {
            return {
                ...prev,
                [name]: value,
            }
        });
    };

    return (
        <div className="dashboard">
            <div className="dashboard__slider-header">
                <h2 className="dashboard__slider-title">Spaces</h2>
                <div className="search">
                    <CustomInput
                        name="spaces"
                        isSearch={true}
                        onChange={onChangeInput}
                        value={search.spaces}
                        placeholder={'Search spaces'}
                    />
                </div>
            </div>
            <div className="dashboard__slider-wrapper">
                <SliderComponent
                    data={data}
                />
            </div>

            <div className="dashboard__slider-header">
                <h2 className="dashboard__slider-title">Clients</h2>
                <div className="search">
                    <CustomInput
                        name="clients"
                        isSearch={true}
                        onChange={onChangeInput}
                        value={search.clients}
                        placeholder={'Search clients'}
                    />
                </div>
            </div>
            <div className="dashboard__slider-wrapper">
                <SliderComponent
                    data={data}
                />
            </div>

            <div className="dashboard__slider-header">
                <h2 className="dashboard__slider-title">Freelancers</h2>
                <div className="search">
                    <CustomInput
                        name="freelancers"
                        isSearch={true}
                        onChange={onChangeInput}
                        value={search.freelancers}
                        placeholder={'Search freelancers'}
                    />
                </div>
            </div>
            <div className="dashboard__slider-wrapper">
                <SliderComponent
                    data={data}
                />
            </div>

            <div className="dashboard__slider-header">
                <h2 className="dashboard__slider-title">MPSPs</h2>
                <div className="search">
                    <CustomInput
                        name="MPSPs"
                        isSearch={true}
                        onChange={onChangeInput}
                        value={search.MPSPs}
                        placeholder={'Search MPSPs'}
                    />
                </div>
            </div>
            <div className="dashboard__slider-wrapper">
                <SliderComponent
                    data={data}
                />
            </div>
        </div>
    )
};
