import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import Task from '../common/task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  width: ${props => props.colWidth};
`;
//width 200 for move and 300 for entry
//width: ${props => props.width};
const Title = styled.h3`
  padding: 8px;
  background-color: ${props =>
    props.checkedInTitle ? 'rgb(59, 88, 99)' : 'rgb(135, 180, 197)'};
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

const Column = props => {
  return (
    <Container colWidth={props.colWidth}>
      <Title checkedInTitle={props.column.title === 'Checked In'}>
        {props.column.title}
      </Title>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {/* fontsize 110% task and 130% entry */}
            {props.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                taskIndex={index}
                fontSize={props.fontSize}
                display={
                  task.spoolName
                    ? task.id + ': ' + task.spoolName
                    : task.forename + ' ' + task.surname
                }
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

Column.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired
};

export default Column;
