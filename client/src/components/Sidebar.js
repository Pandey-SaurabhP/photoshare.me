import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  display: flex;
  width: 250px;
  font-size: 20px;
`;

const Sidebar = styled.div`
  flex: 1;
`;

const CategoryList = styled.ul`
margin-top: 25px;
  list-style-type: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#ddd' : 'transparent')};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const categories = [
    { id: 1, name: 'Nature', tags: ['nature', 'landscape'] },
    { id: 2, name: 'Animals', tags: ['animals', 'wildlife'] },
    { id: 3, name: 'Food', tags: ['food', 'cuisine'] },
    { id: 1, name: 'Nature', tags: ['nature', 'landscape'] },
    { id: 2, name: 'Animals', tags: ['animals', 'wildlife'] },
    { id: 3, name: 'Food', tags: ['food', 'cuisine'] },
    { id: 1, name: 'Nature', tags: ['nature', 'landscape'] },
    { id: 2, name: 'Animals', tags: ['animals', 'wildlife'] },
    { id: 3, name: 'Food', tags: ['food', 'cuisine'] },
    { id: 1, name: 'Nature', tags: ['nature', 'landscape'] },
    { id: 2, name: 'Animals', tags: ['animals', 'wildlife'] },
    { id: 3, name: 'Food', tags: ['food', 'cuisine'] }
];

const SidebarComponent = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <SidebarContainer>
            <Sidebar>
                ***
                <CategoryList>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            selected={selectedCategory === category}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                        </CategoryItem>
                    ))}
                </CategoryList>
            </Sidebar>
        </SidebarContainer>
    );
};

export default SidebarComponent;
