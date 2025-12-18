import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className='px-4 py-2'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-drum-icon lucide-drum"
        >
          <path d="m2 2 8 8" />
          <path d="m22 2-8 8" />
          <ellipse cx={12} cy={9} rx={10} ry={5} />
          <path d="M7 13.4v7.9" />
          <path d="M12 14v8" />
          <path d="M17 13.4v7.9" />
          <path d="M2 9v8a10 5 0 0 0 20 0V9" />
        </svg>
        <span>Próxima Etapa</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    font-family: inherit;
    cursor: pointer;
    font-size: 17px;
    color: white;
    background: #c1121f;
    background: linear-gradient(to right, #c1121f, #a50e1a);
    border: none;
    letter-spacing: 0.05em;
    border-radius: 15px;
  }

  button svg {
    margin-right: 15px;
    transform: rotate(30deg);
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button span {
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button:hover svg {
    transform: translateX(5px) rotate(-10deg);
  }
`;

export default Button;