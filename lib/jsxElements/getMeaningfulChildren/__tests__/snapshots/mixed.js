import Nested, {six} from '../';

const Component = () => (
  <TestWrapper>one<div>two</div><Nested>three</Nested>{"four"}<span>
      <b>five</b>
    </span>{six}{seven()}</TestWrapper>
);
