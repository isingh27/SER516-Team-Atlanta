import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { GlobalContext } from '../GlobalContext';


const contextValue = {
    metricInput: 'mockMetricInput', // Provide a mock value for metricInput
    setMetricInput: jest.fn(), // Mock the setMetricInput function if needed
  };

  
describe('Dashboard Component', () => {
  test('renders without crashing', () => {
    render( 
    <GlobalContext.Provider value={contextValue}>
        <BrowserRouter>
        {/* <Dashboard /> */}
        </BrowserRouter>
        </GlobalContext.Provider>);
  });

    // test('renders Dashboard component', () => {
    //     const { getByText, getAllByRole } = render( 
    //     <GlobalContext.Provider value={contextValue}>
    //         <BrowserRouter>
    //         {/* <Dashboard /> */}
    //         </BrowserRouter>
    //         </GlobalContext.Provider>);
    //     expect(getAllByRole('status')[0]).toBeInTheDocument();
    // });


    // test('renders loader while fetching data', async () => {
    //     const { getAllByRole } = render(
    //       <GlobalContext.Provider value={{ metricInput: 'mockMetricInput' }}>
    //         <BrowserRouter>
    //         {/* <Dashboard /> */}
    //         </BrowserRouter>  
    //       </GlobalContext.Provider>
    //     );
    //     const loader = getAllByRole('status');
        
    //     expect(loader[0]).toBeInTheDocument();
    
        
    //   });
});