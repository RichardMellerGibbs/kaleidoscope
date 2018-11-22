import React, { Component } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 300px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
  background-color: ${props =>
    props.checkedInTitle ? 'rgb(135, 180, 197)' : 'rgb(59, 88, 99)'};
  color: #fff;
  font-weight: 400;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: baackground-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'skyblue' : 'rgb(224, 221, 221)'};
  flex-grow: 1;
  min-height: 100px;
`;

export default class column extends Component {
  render() {
    return (
      <Container>
        <Title checkedInTitle={this.props.column.title === 'Checked In'}>
          {this.props.column.title}
        </Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.tasks.map((task, index) => (
                <Task key={task.id} task={task} taskIndex={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}
