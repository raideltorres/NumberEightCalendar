import styled from 'styled-components';

const CalendarContainer = styled.div`
  padding: 4rem;

  .inputContainer {
    margin: 1rem;

    &.large {
      width: 16rem;
    }
  }

  table {
    width: 14rem;
    border-collapse: separate;
    border-spacing: 0.1rem;
    font-size: 0.8rem;
    margin-top: 2rem;

    .month-year-cell {
      background-color: #f6faeb;
    }

    td {
      width: 2rem;
      height: 2rem;
      text-align: center;

      &.active {
        background-color: #c3db9f;

        &.weekend {
          background-color: #fefb37;
        }

        &.holiday {
          background-color: #f38223;
        }
      }

      &.inactive {
        background-color: #cccccc;
      }
    }
  }

  .react-autosuggest__container {
    flex-grow: 1;
    position: relative;
    height: 18px;
  }

  .react-autosuggest__suggestions-container--open {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
  }

  .react-autosuggest__suggestion {
    display: block;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

export default CalendarContainer;
