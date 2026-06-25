import PoolCard from "../components/PoolCard";

const Section = ({ title, data, type, hideTitle }) => {
  return (
    <div className="mb-10">
      {!hideTitle && title && <h2 className="text-xl mb-4 font-bold">{title}</h2>}

      {data.length === 0 ? (
        <p className="text-gray-400">No pools found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {data.map((pool) => (
            <PoolCard key={pool.id} pool={pool} type={type} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Section;