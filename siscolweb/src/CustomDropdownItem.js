import React, { forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomDropdownItem = forwardRef(({ children, to, ...rest }, ref) => (
  <Dropdown.Item as={Link} ref={ref} to={to} {...rest}>
    {children}
  </Dropdown.Item>
));

CustomDropdownItem.displayName = 'CustomDropdownItem';

// Adicionando a exportação padrão
export default CustomDropdownItem;
