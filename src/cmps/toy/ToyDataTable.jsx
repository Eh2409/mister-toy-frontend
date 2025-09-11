export function ToyDataTable({ toy }) {
    return (
        <table className="toy-data-table">
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>{toy.name}</td>
                </tr>
                <tr>
                    <td>Price</td>
                    <td>${toy.price}</td>
                </tr>
                <tr>
                    <td>Availability</td>
                    <td>{toy.inStock ? "In Stock" : "Out of Stock"}</td>
                </tr>
                <tr>
                    <td>Brands</td>
                    <td>{toy.brands.join(', ')}</td>
                </tr>
                <tr>
                    <td>Companies</td>
                    <td>{toy.companies.join(', ')}</td>
                </tr>
                <tr>
                    <td>Product Types</td>
                    <td>{toy.productTypes.join(', ')}</td>
                </tr>
                <tr>
                    <td colSpan="2" className='p-d'>Product Description</td>
                </tr>
                <tr>
                    <td colSpan="2" className='toy-description'>
                        <pre>{toy.description}</pre>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}