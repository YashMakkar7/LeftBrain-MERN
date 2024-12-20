import { CloseButtonAtom } from "../Atoms/CloseButtonAtom"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { Button } from "../components/ui/Button"
import { CreateContentModel } from "../components/ui/CreateContentModel"
import { RecoilRoot, useSetRecoilState, useRecoilValue } from "recoil"
import { SideBar } from "../components/ui/Sidebar"
import { useContent } from "../hooks/useContent"
import { Card } from "../components/ui/Card"
import { BACKEND_URL, STARTING_URL } from "../config"
import axios from "axios"


export function Document() {
  return <RecoilRoot>
    <Site />
  </RecoilRoot>
}

const Site = () => {
  const content = useContent();
  //@ts-ignore
  const document = content.filter(data => data.type == "document")
  const modelOpen = useRecoilValue(CloseButtonAtom)
  const setModelOpen = useSetRecoilState(CloseButtonAtom)
  return <div>
    <SideBar />
    <div className="p-4 ml-72 min-h-screen bg-grey-100">
      <CreateContentModel open={modelOpen} onClick={() => {
        setModelOpen(setModelOpen => !setModelOpen)
      }}></CreateContentModel>
      <div className="flex justify-end gap-4 pb-6">
        <Button onClick={() => { setModelOpen(setModelOpen => !setModelOpen) }} varient="primary" text="Add Content" startIcon={<PlusIcon />}></Button>
        <Button onClick={async () => {
          const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
            share: true
          }, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          });
          // @ts-ignore
          const shareURL = `${STARTING_URL}${response.data.hash}`
          // Copy to clipboard and alert the URL
          navigator.clipboard
            .writeText(shareURL)
            .then(() => {
              alert(`Copied to clipboard: ${shareURL}`);
            })
            .catch((err) => {
              console.error("Failed to copy:", err);
              alert("Failed to copy the link. Please try again.");
            });
        }} varient="secondary" text="Share Brain" startIcon={<ShareIcon />}></Button>
      </div>
      <div className="ml-6">
        <div className=" flex gap-6 flex-wrap">
          {document.map(({ type, link, title, description, _id }) => <Card
            link={link}
            title={title}
            type={type}
            description={description}
            id={_id}
          />)}
        </div>
      </div>

    </div>
  </div>
}