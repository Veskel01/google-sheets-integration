export interface IAccessTokenRes {
  data: {
    token: string;
    session_id: string;
  };
}

export type FormDtoType = Record<string, unknown> & IFormBody;

interface IFormBody {
  Sygnatura_czasowa: string;
  Zostaw_swójemailnumertelefonużebyśmymoglisięzTobąskontaktować: string;
  Dodaj_informacjęotymkiedymożemydoCiebiezadzwonićlubnapisać: string;
  Abyśmy_moglisprawdzićTwojeaktualneosiągnięciazostawnamlinkdoswojegogithubalubnazwę: string;
}
