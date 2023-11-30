import ReleaseDate from "./release-date";
import SubjectType from "./subject-type";
import Title from "./title";

export default class Subject {
    constructor(
        public readonly title: Title,
        public readonly type: SubjectType,
        public readonly releaseDate?: ReleaseDate,
    ) {}
}
