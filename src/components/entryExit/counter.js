import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 180px;
  height: 100px;
  text-align: center;
  color: #fff;
  font-size: 150%;
  background-color: #2d2d2d;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
`;

//Vertical center
const Count = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;
const Counter = props => {
  return (
    <Container>
      <Count>{props.countValue}</Count>
    </Container>
  );
};

export default Counter;
