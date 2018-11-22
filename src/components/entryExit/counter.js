import React, { Component } from 'react';
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
  background-color: black;

  display: flex;
  flex-direction: column;
`;

const Count = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

export default class counter extends Component {
  render() {
    return (
      <Container>
        <Count>{this.props.countValue}</Count>
      </Container>
    );
  }
}