import fixtures from "../../test/fixtures"
import {createZealotMock} from "zealot"
import initTestStore from "../../test/initTestStore"
import Workspaces from "../../state/Workspaces"
import Current from "../../state/Current"
import {saveWorkspace} from "./saveWorkspace"
import brim from "src/js/brim"

let store, mock
const select = (selector) => selector(store.getState())

const workspaceCount = () => select(Workspaces.all).length
const ws1 = fixtures("workspace1")
const ws2 = fixtures("workspace2")

beforeEach(() => {
  mock = createZealotMock()
    .stubPromise("version", "1")
    .stubPromise("spaces.list", [])
    .stubPromise("version", "1")
    .stubPromise("spaces.list", [])
  store = initTestStore(mock.zealot)
  store.dispatchAll([Workspaces.add(ws1), Current.setWorkspaceId(ws1.id)])
})

test("Create a new workspace, switch back", async () => {
  expect(workspaceCount()).toBe(1)
  await store.dispatch(saveWorkspace(brim.workspace(ws2), "connected"))
  expect(workspaceCount()).toBe(2)
  expect(select(Workspaces.id(ws2.id))).toEqual(ws2)
  expect(select(Current.getWorkspaceId)).toBe(ws2.id)

  await store.dispatch(saveWorkspace(brim.workspace(ws1), "connected"))
  expect(workspaceCount()).toBe(2)
  expect(select(Workspaces.id(ws1.id))).toEqual(ws1)
  expect(select(Current.getWorkspaceId)).toBe(ws1.id)
})
