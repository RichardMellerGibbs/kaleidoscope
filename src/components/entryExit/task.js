import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  border-radius: 5px;
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
            {this.props.task.title} {this.props.task.forename}{' '}
            {this.props.task.surname}
          </Container>
        )}
      </Draggable>
    );
  }
}
