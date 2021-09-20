const saveItem = <T = object>(key: string, storeVar: T): boolean => {
  
  if (!localStorage) {
    return false;
  }

  try {
    const serializedVar = JSON.stringify(storeVar);
    localStorage.setItem(key, serializedVar);
    return true;
  } catch (error) {
    return false;
  }
}

const loadItem = <T = object>(key: string): T => {

  try {
    const serializedVar = localStorage.getItem(key)!;
    return JSON.parse(serializedVar) as T;
  } catch (error) {
    return undefined as unknown as T;
  }
}

export default {
  saveItem,
  loadItem
}