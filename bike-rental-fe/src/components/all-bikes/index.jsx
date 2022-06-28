import BikeCard from "../atoms/bike-card";
import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {BikeModels, ColorTypes} from "../../lib/constants/constants";
import CCheckbox from "../atoms/checkbox";
import {useEffect, useState} from "react";
import {Container, FilterBox, FilterWrapper} from "./styles";
import {Pagination} from "@mui/lab";

const initFilter = {
    model: [], color: [], avgRating: []
}

const AllBikes = ({bikeList, handelBooking, setForm, form}) => {
    const [allBikes, setAllBikes] = useState([])
    const [pages, setPages] = useState({});
    const [selectedFilter, setSelectedFilter] = useState(initFilter)

    const handleCheckboxChange = (title, key) => {
        const index = selectedFilter[key]?.indexOf(title)
        let newAr
        if (index > -1) {
            newAr = selectedFilter[key]
            newAr.splice(index, 1)
        } else newAr = [...selectedFilter[key], title]
        setSelectedFilter({...selectedFilter, [key]: newAr})
    }
    const clearFilter = () => {
        setSelectedFilter(initFilter)
        setAllBikes(bikeList?.bikes)
    }

    useEffect(() => {
        let filteredBikes = []
        if (JSON.stringify(selectedFilter) === JSON.stringify(initFilter))
            setAllBikes(bikeList?.bikes)
        else {
            filteredBikes = allBikes.filter(function (item) {
                for (let key in selectedFilter) {
                    if (item[key] !== undefined && selectedFilter[key]?.includes(item[key]))
                        return true;
                }
                return false;
            });
            setAllBikes(filteredBikes)
        }
    }, [selectedFilter])
    useEffect(() => {
        setAllBikes(bikeList.bikes)
        setSelectedFilter(initFilter)
        setPages({currPage: bikeList?.page, totalPages: bikeList?.pageCount})
    }, [bikeList])
    useEffect(() => {
        setForm({...form, page: pages.currPage})
    }, [pages.currPage])

    return (
        <Container spacing={2}>
            <FilterWrapper container flexDirection='column' justifyContent='flex-start' md={3}>
                <FilterBox variant='elevation' elevation={5}>
                    <Grid container flexDirection='row' justifyContent='space-between'>
                        <Typography variant='h5'>FILTER</Typography>
                        <Button variant="outlined" onClick={clearFilter}>clear</Button>
                    </Grid>
                    <div className="filter">
                        <div className="filter_heading">Models</div>
                        <div className="filter_content">
                            {Object.keys(BikeModels).map(key => <CCheckbox key={key} base='model' title={key}
                                                                           onChange={handleCheckboxChange}
                                                                           checked={selectedFilter.model.includes(key)}/>)}
                        </div>
                        <div className="filter_heading">Colors</div>
                        <div className="filter_content">
                            {ColorTypes.map(key => <CCheckbox key={key} base='color' title={key}
                                                              onChange={handleCheckboxChange}
                                                              checked={selectedFilter.color.includes(key)}
                            />)}
                        </div>
                        <div className="filter_heading">Ratings</div>
                        <div className="filter_content">
                            {[1, 2, 3, 4, 5].map(key => <CCheckbox key={key} base='avgRating' title={key} rating
                                                                   onChange={handleCheckboxChange}
                                                                   checked={selectedFilter.avgRating.includes(key)}/>)}
                        </div>
                    </div>
                </FilterBox>
            </FilterWrapper>
            <Grid container md={9} justifyContent="center">
                <Grid container justifyContent="center" spacing={5} className='all-bike-wrapper'>
                    {Array.isArray(allBikes) && allBikes.length > 0 && allBikes.map(bike => (
                        <BikeCard key={bike.id} bikeObj={bike} handelBooking={handelBooking}/>))}
                    {Array.isArray(allBikes) && allBikes.length <= 0 && (
                        <Typography variant="h4">No Bikes Found</Typography>)}
                </Grid>
                <Grid item className="pagination-style">
                    {bikeList?.bikes?.length !== 0 && <Pagination
                        count={pages.totalPages}
                        page={pages.currPage}
                        onChange={(_, pageNumber) => setPages({...pages, currPage: pageNumber})}
                        color="primary"
                    />}
                </Grid>
            </Grid>
        </Container>
    )
}

export default AllBikes;