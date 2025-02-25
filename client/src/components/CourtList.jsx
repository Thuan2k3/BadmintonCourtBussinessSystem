import { Button, Card, Tag } from "antd";

const CourtList = ({ courts, onSelectCourt }) => {
  return (
    <Card title="Danh Sách Sân" bordered>
      <div className="d-flex flex-wrap">
        {courts.map((court) => (
          <Button
            key={court._id}
            className="m-2"
            style={{
              width: 120,
              height: 120,
              backgroundColor: court.isEmpty ? "#52c41a" : "#595959",
              color: "#fff",
            }}
            onClick={() => onSelectCourt(court)}
          >
            {court.name} <br />
            {court.isEmpty ? (
              <Tag color="green">Trống</Tag>
            ) : (
              <Tag color="red">Có người</Tag>
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CourtList;
