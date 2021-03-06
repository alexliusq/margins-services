"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.CreateAnnotationForLocationTestingDocument = exports.ConnectAuthorToPublicationDocument = exports.GetAuthorByFullNameDocument = exports.GetPublicationByAccountAndTitleDocument = exports.CreatePublicationDocument = exports.CreateAuthorDocument = exports.AddTagToAnnotationDocument = exports.GetTagByAccountIdAndNameDocument = exports.GetAllTagsForAccountDocument = exports.CreateTagDocument = exports.UpdateAnnotationByHighlightDocument = exports.GetAllAnnotationsByPublicationDocument = exports.CreateAnnotationDocument = exports.GetAccountByEmailDocument = exports.GetAccountByAccountIdDocument = exports.CreateAccountDocument = void 0;
const graphql_1 = require("graphql");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.CreateAccountDocument = graphql_tag_1.default `
    mutation CreateAccount($accountInput: CreateAccountInput!) {
  createAccount(input: $accountInput) {
    __typename
    account {
      accountId
      email
      createdAt
      emailVerified
      firstName
      updatedAt
      lastName
    }
  }
}
    `;
exports.GetAccountByAccountIdDocument = graphql_tag_1.default `
    query GetAccountByAccountId($accountId: UUID!) {
  accountByAccountId(accountId: $accountId) {
    accountId
    email
    emailVerified
    group
  }
}
    `;
exports.GetAccountByEmailDocument = graphql_tag_1.default `
    query GetAccountByEmail($email: String!) {
  accountByEmail(email: $email) {
    accountId
    email
  }
}
    `;
exports.CreateAnnotationDocument = graphql_tag_1.default `
    mutation CreateAnnotation($inputAnnotation: CreateAnnotationInput!) {
  __typename
  createAnnotation(input: $inputAnnotation) {
    annotation {
      annotationId
      highlightLocation
      highlightText
      noteLocation
      noteText
    }
  }
}
    `;
exports.GetAllAnnotationsByPublicationDocument = graphql_tag_1.default `
    query GetAllAnnotationsByPublication($annotationCondition: AnnotationCondition!) {
  __typename
  allAnnotations(condition: $annotationCondition) {
    nodes {
      annotationId
      highlightLocation
      highlightText
      color
      noteLocation
      noteText
      tagsByAnnotationTagAnnotationIdAndTagId {
        nodes {
          tagId
          tagName
        }
      }
    }
  }
}
    `;
exports.UpdateAnnotationByHighlightDocument = graphql_tag_1.default `
    mutation UpdateAnnotationByHighlight($updateAnnotation: UpdateAnnotationByPublicationIdAndAccountIdAndHighlightLocationAndHighlightTextInput!) {
  __typename
  updateAnnotationByPublicationIdAndAccountIdAndHighlightLocationAndHighlightText(
    input: $updateAnnotation
  ) {
    annotation {
      annotationId
      highlightLocation
      highlightText
      color
      noteLocation
      noteText
    }
  }
}
    `;
exports.CreateTagDocument = graphql_tag_1.default `
    mutation CreateTag($inputTag: CreateTagInput!) {
  __typename
  createTag(input: $inputTag) {
    tag {
      id
      tagId
      tagName
    }
  }
}
    `;
exports.GetAllTagsForAccountDocument = graphql_tag_1.default `
    query GetAllTagsForAccount($accountId: UUID!) {
  __typename
  allTags(condition: {accountId: $accountId}) {
    nodes {
      tagId
      id
      tagName
    }
  }
}
    `;
exports.GetTagByAccountIdAndNameDocument = graphql_tag_1.default `
    query GetTagByAccountIdAndName($accountId: UUID!, $tagName: String!) {
  tagByAccountIdAndTagName(accountId: $accountId, tagName: $tagName) {
    tagId
    tagName
  }
}
    `;
exports.AddTagToAnnotationDocument = graphql_tag_1.default `
    mutation AddTagToAnnotation($annotationId: String!, $tagId: String!) {
  __typename
  createAnnotationTag(
    input: {annotationTag: {annotationId: $annotationId, tagId: $tagId}}
  ) {
    annotationTag {
      annotationId
      tagId
    }
  }
}
    `;
exports.CreateAuthorDocument = graphql_tag_1.default `
    mutation CreateAuthor($authorInput: CreateAuthorInput!) {
  createAuthor(input: $authorInput) {
    __typename
    author {
      authorId
      fullName
    }
  }
}
    `;
exports.CreatePublicationDocument = graphql_tag_1.default `
    mutation CreatePublication($publicationInput: CreatePublicationInput!) {
  createPublication(input: $publicationInput) {
    __typename
    publication {
      createdAt
      id
      updatedAt
      publicationId
      title
      accountId
    }
  }
}
    `;
exports.GetPublicationByAccountAndTitleDocument = graphql_tag_1.default `
    query GetPublicationByAccountAndTitle($accountId: UUID!, $title: String!) {
  __typename
  publicationByAccountIdAndTitle(accountId: $accountId, title: $title) {
    publicationId
    title
    accountId
    additionalMeta
  }
}
    `;
exports.GetAuthorByFullNameDocument = graphql_tag_1.default `
    query GetAuthorByFullName($fullName: String!) {
  __typename
  authorByFullName(fullName: $fullName) {
    authorId
    fullName
  }
}
    `;
exports.ConnectAuthorToPublicationDocument = graphql_tag_1.default `
    mutation ConnectAuthorToPublication($authorAndPublication: CreatePublicationAuthorInput!) {
  __typename
  createPublicationAuthor(input: $authorAndPublication) {
    publicationAuthor {
      authorId
      publicationId
    }
  }
}
    `;
exports.CreateAnnotationForLocationTestingDocument = graphql_tag_1.default `
    mutation CreateAnnotationForLocationTesting($inputAnnotation: CreateAnnotationInput!) {
  __typename
  createAnnotation(input: $inputAnnotation) {
    annotation {
      annotationId
      highlightLocation
      highlightText
      noteText
      noteLocation
    }
  }
}
    `;
const defaultWrapper = sdkFunction => sdkFunction();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        CreateAccount(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreateAccountDocument), variables));
        },
        GetAccountByAccountId(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetAccountByAccountIdDocument), variables));
        },
        GetAccountByEmail(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetAccountByEmailDocument), variables));
        },
        CreateAnnotation(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreateAnnotationDocument), variables));
        },
        GetAllAnnotationsByPublication(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetAllAnnotationsByPublicationDocument), variables));
        },
        UpdateAnnotationByHighlight(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.UpdateAnnotationByHighlightDocument), variables));
        },
        CreateTag(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreateTagDocument), variables));
        },
        GetAllTagsForAccount(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetAllTagsForAccountDocument), variables));
        },
        GetTagByAccountIdAndName(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetTagByAccountIdAndNameDocument), variables));
        },
        AddTagToAnnotation(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.AddTagToAnnotationDocument), variables));
        },
        CreateAuthor(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreateAuthorDocument), variables));
        },
        CreatePublication(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreatePublicationDocument), variables));
        },
        GetPublicationByAccountAndTitle(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetPublicationByAccountAndTitleDocument), variables));
        },
        GetAuthorByFullName(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.GetAuthorByFullNameDocument), variables));
        },
        ConnectAuthorToPublication(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.ConnectAuthorToPublicationDocument), variables));
        },
        CreateAnnotationForLocationTesting(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.CreateAnnotationForLocationTestingDocument), variables));
        }
    };
}
exports.getSdk = getSdk;
//# sourceMappingURL=types.js.map