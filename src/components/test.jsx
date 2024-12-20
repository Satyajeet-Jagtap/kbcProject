{lifelines.map((item, index) => (
  <div key={item.id}>
    <div className={lifelineHover[index] ? "lifeline-info" : "lifeline-info hide"}>
      {item.info}
    </div>
    <div
      onClick={() => lifeLineClicked(index, item)}
      // onMouseEnter={() => {
      //   const updatedHover = [...lifelineHover];
      //   updatedHover[index] = true;
      //   setLifelineHover(updatedHover);
      // }}
      // onMouseLeave={() => {
      //   const updatedHover = [...lifelineHover];
      //   updatedHover[index] = false;
      //   setLifelineHover(updatedHover);
      // }}
      className="lifeline-item"
    >
      {item.icon ? item.icon : item.text}
    </div>
    {/* 
    <div className={lifelineHover[index] ? "lifeline-desc" : "lifeline-desc hide"}>
      {item.description}
    </div> 
    */}
  </div>
))}
