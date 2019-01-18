import React, { Component } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? "lightgreen" : "white")};
  border-radius: 5px;
  height: 80px;
  font-size: 110%;
`;

export default class task extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.taskIndex}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {this.props.task.id}: {this.props.task.spoolName}
          </Container>
        )}
      </Draggable>
    );
  }
}
