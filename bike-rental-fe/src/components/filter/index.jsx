import {Button, Grid, Typography} from "@mui/material";
import {BikeModels, ColorTypes} from "../../lib/constants/constants";
import CCheckbox from "../atoms/checkbox";
import {FilterBox} from "./styles";

const Filter = ({handleCheckboxChange, filterObj, clear}) => {
    return (
        <>
            <FilterBox variant='elevation' elevation={5}>
                <Grid container flexDirection='row' justifyContent='space-between'>
                    <Typography variant='h5'>FILTER</Typography>
                    <Button variant="outlined" onClick={clear}>clear</Button>
                </Grid>
                <div className="filter">
                    <div className="filter_heading">Models</div>
                    <div className="filter_content">
                        {Object.keys(BikeModels).map(key => <CCheckbox key={key} base='model' title={key}
                                                                       onChange={handleCheckboxChange}
                                                                       checked={filterObj.model.includes(key)}/>)}
                    </div>
                    <div className="filter_heading">Colors</div>
                    <div className="filter_content">
                        {ColorTypes.map(key => <CCheckbox key={key} base='color' title={key}
                                                          onChange={handleCheckboxChange}
                                                          checked={filterObj.color.includes(key)}
                        />)}
                    </div>
                    <div className="filter_heading">Ratings</div>
                    <div className="filter_content">
                        {[1, 2, 3, 4, 5].map(key => <CCheckbox key={key} base='avgRating' title={key} rating
                                                               onChange={handleCheckboxChange}
                                                               checked={filterObj.avgRating.includes(key)}/>)}
                    </div>
                </div>
            </FilterBox>
        </>
    )
}

export default Filter;