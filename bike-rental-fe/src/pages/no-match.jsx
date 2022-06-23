import styled from "styled-components";

export const PageNotFound = () => {
    return (
        <NotFoundWrapper>
            <span>404!</span>
            <h3>Page not found</h3>
        </NotFoundWrapper>
    )
}

const NotFoundWrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 500px;
  span {
    font-weight: bolder;
    font-size: 20px;
  }
`