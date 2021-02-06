import * as React from 'react';
import styled from 'styled-components';

const StyledFormWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 100%;
`;

const StyledForm = styled.form`
  margin: 0 10px;
  padding: 20px;
  border-radius: 10px;
`;

const StyledInput = styled.input`
  
`;

const Login: React.FC = () => {
  return (
      <StyledFormWrapper>
          <StyledForm>
              <input type="text" name="userid" id="userid" placeholder="Userid" required/>
              <input type="password" name="password" id="password" placeholder="Password" required/>
          </StyledForm>
      </StyledFormWrapper>
  )
}

export default Login;