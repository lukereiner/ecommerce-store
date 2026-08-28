import React from 'react'

const RecentlyAddedItems = () => {

    const items = [
    { id: 1, name: "Corn" },
    { id: 2, name: "Berries" },
    { id: 3, name: "Peanuts" },
  ];

  return (
    <>
    <div id="main" className="flex flex-col items-center justify-center w-full pt-4">
        <div id="heading" className="text-3xl font-bold mb-4">Recently Added Items</div>

        <div id="items">
          <ul className="flex flex-row gap-4">
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default RecentlyAddedItems